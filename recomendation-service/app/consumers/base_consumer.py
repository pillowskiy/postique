import inspect
import json
import logging
from functools import wraps
from typing import (Type, get_type_hints)

from aio_pika import IncomingMessage, connect_robust
from app.config import settings
from pydantic import BaseModel, ValidationError, create_model


def message_handler(
    pattern: str = None, model: Type[BaseModel] = None
):
    def decorator(func):
        setattr(func, "_is_message_handler", True)
        setattr(func, "_pattern", pattern)
        setattr(func, "_model", model)

        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            return await func(self, *args, **kwargs)

        return wrapper

    return decorator


class BaseConsumer:
    EXCHANGE_NAME = None
    EXCHANGE_TYPE = "fanout"
    QUEUE_NAME = None
    ROUTING_KEY = ""

    def __init__(self):
        self.connection = None
        self.channel = None
        self._handlers = []
        self._scan_handlers()

    def _scan_handlers(self):
        for _, method in inspect.getmembers(self, predicate=inspect.ismethod):
            if hasattr(method, "_is_message_handler"):
                pattern = getattr(method, "_pattern", None)
                exchange = getattr(method, "_exchange", self.EXCHANGE_NAME)
                model = getattr(method, "_model", None)

                if model is None:
                    hints = get_type_hints(method)
                    param_names = list(inspect.signature(method).parameters.keys())[1:]
                    if param_names and param_names[0] in hints:
                        param_type = hints[param_names[0]]
                        if isinstance(param_type, type) and issubclass(
                            param_type, BaseModel
                        ):
                            model = param_type

                self._handlers.append((pattern, exchange, model, method))

    async def setup(self):
        self.connection = await connect_robust(settings.RABBITMQ_URL)
        self.channel = await self.connection.channel()

        exchange = await self.channel.declare_exchange(
            self.EXCHANGE_NAME, type=self.EXCHANGE_TYPE, durable=True
        )

        queue_name = (
            self.QUEUE_NAME or f"{self.__class__.__name__.lower()}.{self.EXCHANGE_NAME}"
        )

        logging.info(
            f"Declaring exchange: {self.EXCHANGE_NAME}, queue: {queue_name}"
        )
        queue = await self.channel.declare_queue(queue_name, durable=True)
        await queue.bind(exchange, routing_key=self.ROUTING_KEY)
        await queue.consume(self.process_message)

        logging.info(
            f"Consumer started for exchange: {self.EXCHANGE_NAME}, queue: {queue_name}"
        )

    async def process_message(self, message: IncomingMessage):
        async with message.process():
            try:
                message_data = json.loads(message.body.decode())
                message_type = message_data.get("pattern", "")
                message_payload = message_data.get("data", {})
                logging.debug(f"Received message of type: {message_type}")

                handled = False
                for pattern, _, model, handler in self._handlers:
                    if pattern is None or (
                        pattern and message_type and message_type.startswith(pattern)
                    ):
                        validated_data = message_payload
                        if model is not None:
                            try:
                                validated_data = model(**message_payload)
                            except ValidationError as e:
                                logging.error(
                                    f"Validation error for message {message_type}: {e}"
                                )
                                continue

                        if model is not None:
                            await handler(validated_data)
                        else:
                            await handler(message_payload)

                        handled = True

                if not handled:
                    logging.debug(f"No handler found for message type: {message_type}")

            except json.JSONDecodeError:
                logging.error("Failed to decode message as JSON")
            except Exception as e:
                logging.error(f"Error processing message: {e}")

    async def close(self):
        if self.connection:
            await self.connection.close()
            logging.info("Consumer connection closed")
