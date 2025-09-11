package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="document_number")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DocumentNumber  extends Auditable {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name= "doc_type")
    private String docType;

    @Column(name= "sub_doc_type")
    private String subDocType;

    @Column(name= "year")
    private String year;

    @Column(name= "document_number")
    private Integer documentNumber;

    @Column(name= "hospital_id")
    private Integer hospitalId;
}
