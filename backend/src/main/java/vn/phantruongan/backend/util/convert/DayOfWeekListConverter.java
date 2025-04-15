package vn.phantruongan.backend.util.convert;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.AttributeConverter;

public class DayOfWeekListConverter implements AttributeConverter<List<DayOfWeek>, String> {
    private static final String SEPARATOR = ", ";

    @Override
    public String convertToDatabaseColumn(List<DayOfWeek> dayOfWeeks) {
        if (dayOfWeeks == null || dayOfWeeks.isEmpty()) {
            return "";
        }

        return dayOfWeeks.stream()
                .map(Enum::name)
                .collect(Collectors.joining(SEPARATOR));
    }

    @Override
    public List<DayOfWeek> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return List.of();
        }
        return Arrays.stream(dbData.split(SEPARATOR))
                .map(String::trim)
                .map(DayOfWeek::valueOf)
                .collect(Collectors.toList());
    }

}
