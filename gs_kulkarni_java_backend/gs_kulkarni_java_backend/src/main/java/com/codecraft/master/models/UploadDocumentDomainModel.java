package com.codecraft.master.models;

import com.codecraft.master.entities.UploadDocument;
import com.codecraft.master.repositories.UploadDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class UploadDocumentDomainModel {

	private static final Logger logger = LoggerFactory.getLogger(UploadDocumentDomainModel.class);
	
	@Autowired
	UploadDocumentRepository uploadDocumentRepo;
	
	public void enrichUploadDocumentDomain(int docTypeId, String docType, String fileName,
			UploadDocument uploadDocumentDomain) {
		logger.info("UploadDocumentDomainModel: enrichUploadDocumentDomain() started for docTypeId {}, docType{}", docTypeId, docType);
		uploadDocumentDomain.setDocTypeId(docTypeId);
		uploadDocumentDomain.setDocType(docType);
		uploadDocumentDomain.setDocType("TA");
		uploadDocumentDomain.setDocName(fileName);
		logger.info("UploadDocumentDomainModel: enrichUploadDocumentDomain()  ended {} : ", uploadDocumentDomain);
	}

}
