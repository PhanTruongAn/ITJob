package vn.phantruongan.backend.config.common;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Main queue
    public static final String QUEUE_RECOMMENDATION_EMAIL = "recommendation.email.queue";
    public static final String EXCHANGE_RECOMMENDATION_EMAIL = "recommendation.email.exchange";
    public static final String ROUTING_KEY_RECOMMENDATION_EMAIL = "recommendation.email.routingKey";

    // Dead Letter Queue (DLQ) - nhận message khi consumer reject/throw
    public static final String QUEUE_RECOMMENDATION_EMAIL_DLQ = "recommendation.email.queue.dlq";
    public static final String EXCHANGE_RECOMMENDATION_EMAIL_DLQ = "recommendation.email.exchange.dlq";

    // DLQ Exchange & Queue

    @Bean
    public TopicExchange recommendationEmailDlqExchange() {
        return new TopicExchange(EXCHANGE_RECOMMENDATION_EMAIL_DLQ);
    }

    /**
     * Dead Letter Queue: nhận tất cả message bị reject (lỗi không nên retry).
     * Durable=true để không mất message khi restart broker.
     */
    @Bean
    public Queue recommendationEmailDlqQueue() {
        return QueueBuilder.durable(QUEUE_RECOMMENDATION_EMAIL_DLQ).build();
    }

    @Bean
    public Binding bindingRecommendationEmailDlq(
            TopicExchange recommendationEmailDlqExchange) {
        return BindingBuilder.bind(recommendationEmailDlqQueue())
                .to(recommendationEmailDlqExchange)
                .with("#"); // accept all routing keys
    }

    // Main Exchange & Queue

    @Bean
    public TopicExchange recommendationEmailExchange() {
        return new TopicExchange(EXCHANGE_RECOMMENDATION_EMAIL);
    }

    /**
     * Main queue: khi consumer reject (không requeue), message chuyển sang DLQ.
     * x-dead-letter-exchange trỏ tới DLQ exchange.
     */
    @Bean
    public Queue recommendationEmailQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", EXCHANGE_RECOMMENDATION_EMAIL_DLQ);
        return QueueBuilder.durable(QUEUE_RECOMMENDATION_EMAIL).withArguments(args).build();
    }

    @Bean
    public Binding bindingRecommendationEmail(
            Queue recommendationEmailQueue,
            TopicExchange recommendationEmailExchange) {
        return BindingBuilder.bind(recommendationEmailQueue)
                .to(recommendationEmailExchange)
                .with(ROUTING_KEY_RECOMMENDATION_EMAIL);
    }

    // Converter & Template

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
            MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }

    /**
     * Cấu hình listener container:
     * - defaultRequeueRejected = false: khi consumer throw exception, message
     * KHÔNG bị requeue lại main queue (tránh vòng lặp vô hạn), thay vào đó
     * nó sẽ được chuyển sang DLQ theo cấu hình x-dead-letter-exchange.
     */
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter jsonMessageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter);
        factory.setDefaultRequeueRejected(false); // key setting: no infinite loop
        return factory;
    }
}
