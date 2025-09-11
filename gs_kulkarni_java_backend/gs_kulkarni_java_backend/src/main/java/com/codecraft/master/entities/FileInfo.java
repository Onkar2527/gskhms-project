package com.codecraft.master.entities;

import com.codecraft.master.audit.Auditable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileInfo  extends Auditable {
	private String name;
	private String url;
	
}