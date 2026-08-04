package vn.phantruongan.backend.config.cache;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class CacheConfiguration {

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // Permissions: 1 hour TTL
        cacheConfigurations.put("permissions", defaultConfig.entryTtl(Duration.ofHours(1)));

        // Companies: 30 mins TTL
        cacheConfigurations.put("companies", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigurations.put("companyDetails", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        // Jobs: 15 mins TTL
        cacheConfigurations.put("jobs", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("jobDetails", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("latestJobs", defaultConfig.entryTtl(Duration.ofMinutes(15)));

        // Metadata: 24 hours TTL
        cacheConfigurations.put("skills", defaultConfig.entryTtl(Duration.ofHours(24)));
        cacheConfigurations.put("countries", defaultConfig.entryTtl(Duration.ofHours(24)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}
