package com.codecraft.master.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateReqBody {

    private List<KeyValueClass> keyValueList;

    private String expression;
}
