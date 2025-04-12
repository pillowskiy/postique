import { mixin } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

export const SpecificTransportEventPattern =
  (transport: symbol) => (metadata?: string, extras?: Record<string, any>) =>
    EventPattern(metadata, transport, extras);

export const CustomTransport = (transport: symbol) => {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    const customTransportClass = class extends constructor {
      transportId = transport;
    };
    return mixin(customTransportClass);
  };
};
