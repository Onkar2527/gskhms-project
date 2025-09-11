package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "operation_status")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OperationStatus extends Auditable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "operation_id")
    private Integer operationId;

    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_date")
    private Date startDateTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_date")
    private Date endDateTime;

    @Column(name = "operation_status")
    private String operationStatus;

    @Column(name = "operation_note")
    private String operationNote;

    @Column(name = "precautionary_note")
    private String precautionaryNote;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "folloup_date")
    private Date folloupDate;

    @Column(name = "pre_clean_status")
    private String preCleaningStatus;

    @Column(name = "post_clean_status")
    private String postCleaningStatus;

    @Column(name = "hospital_id")
    private Integer hospitalId;

}