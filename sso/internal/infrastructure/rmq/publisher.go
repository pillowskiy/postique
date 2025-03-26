package rmq

import (
	"encoding/json"
	"fmt"
	"log"

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
	conn      *amqp.Connection
	channel   *amqp.Channel
	exchange  string
	queueName string
}

func MustRabbitMQProducer(amqpURL, exchange, queueName string) *RabbitMQProducer {
	rmq, err := NewRabbitMQProducer(amqpURL, exchange, queueName)
	if err != nil {
		panic(err)
	}

	return rmq
}

func NewRabbitMQProducer(amqpURL, exchange, queueName string) (*RabbitMQProducer, error) {
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	return &RabbitMQProducer{
		conn:      conn,
		channel:   ch,
		exchange:  exchange,
		queueName: queueName,
	}, nil
}

func (p *RabbitMQProducer) Publish(e event.Event) error {
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
	fmt.Println(string(body), err)
	if err != nil {
		log.Printf("Failed to publish event: %v", err)
		return err
	}

	return nil
}

func (p *RabbitMQProducer) Close() {
	p.channel.Close()
	p.conn.Close()
}
