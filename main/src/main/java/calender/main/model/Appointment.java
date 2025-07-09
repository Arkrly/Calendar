package calender.main.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    private String instructorName;
    private LocalDate startDate;

    @Setter
    @Getter
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    public void setId(Long id) {
    }

    // Getters and setters
}