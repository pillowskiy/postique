package rmq

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/pillowskiy/postique/sso/internal/domain/event"
	"github.com/streadway/amqp"
)

type RabbitMQEvent struct {
	Pattern string `json:"pattern"`
	Data    any    `json:"data"`
}

func (e RabbitMQEvent) Marshal() ([]byte, error) {
	return json.Marshal(e)
}

type RabbitMQProducer struct {
	amqpURL   string
	exchange  string
	queueName string

	conn    *amqp.Connection
	channel *amqp.Channel
	lock    sync.Mutex
}

func MustRabbitMQProducer(amqpURL, exchange, queueName string) *RabbitMQProducer {
	rmq, err := NewRabbitMQProducer(amqpURL, exchange, queueName)
	if err != nil {
		panic(err)
	}
	return rmq
}

func NewRabbitMQProducer(amqpURL, exchange, queueName string) (*RabbitMQProducer, error) {
	producer := &RabbitMQProducer{
		amqpURL:   amqpURL,
		exchange:  exchange,
		queueName: queueName,
	}
	err := producer.connect()
	return producer, err
}

func (p *RabbitMQProducer) connect() error {
	conn, err := amqp.Dial(p.amqpURL)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open channel: %w", err)
	}

	p.conn = conn
	p.channel = ch
	return nil
}

func (p *RabbitMQProducer) ensureConnection() error {
	p.lock.Lock()
	defer p.lock.Unlock()

	if p.conn == nil || p.conn.IsClosed() || p.channel == nil {
		if err := p.connect(); err != nil {
			return fmt.Errorf("reconnect failed: %w", err)
		}
	}
	return nil
}

func (p *RabbitMQProducer) Publish(e event.Event) error {
	if err := p.ensureConnection(); err != nil {
		return err
	}

	body, err := RabbitMQEvent{Pattern: string(e.Name), Data: e.Payload}.Marshal()
	if err != nil {
		return err
	}

	err = p.channel.Publish(
		p.exchange,
		p.queueName,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish event: %w", err)
	}

	return nil
}

func (p *RabbitMQProducer) Close() {
	if p.channel != nil {
		_ = p.channel.Close()
	}
	if p.conn != nil {
		_ = p.conn.Close()
	}
}
