package com.codecraft.master.services.impl;

import com.codecraft.master.configs.UserContext;
import com.codecraft.master.constant.MasterConstant;
import com.codecraft.master.entities.FileInfo;
import com.codecraft.master.entities.UploadDocument;
import com.codecraft.master.exceptions.MasterManagerException;
import com.codecraft.master.models.MasterManagerResponse;
import com.codecraft.master.models.UploadDocumentDomainModel;
import com.codecraft.master.repositories.UploadDocumentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;


@Service
@Slf4j
public class UploadDocumentService {


	@Value(("${upload.file.path}"))
	private String uploadFilePath;
	
	@Autowired
	UploadDocumentRepository uploadDocumentRepo;
	
	@Autowired
	UploadDocumentDomainModel uploadDocumentDomainModel;

	public UploadDocumentService() {
		super();
	}


	@Transactional
	public UploadDocument save(int docTypeId, String docType, String docName, Integer hospitalId, MultipartFile file) {
		log.info("UploadDocumentService : save() start for file {}:", file);

		if (file.isEmpty()) {
			throw new MasterManagerException("Request must contain file");
		}
		if (docTypeId == 0) {
			throw new MasterManagerException("Request must contain document Id");
		}
		if (StringUtils.isBlank(docType)) {
			throw new MasterManagerException("Request must contain document type");
		}
		if (StringUtils.isBlank(docName)) {
			throw new MasterManagerException("Request must contain document name");
		}

		UploadDocument uploadDocumentDomain = new UploadDocument();

		try {
			String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
			String ext = FilenameUtils.getExtension(file.getOriginalFilename());
			String fileName = docTypeId + "_" + hospitalId + "_" + date + "." + ext;

			String parentUploadDir = uploadFilePath + "/" + docType;
			 String childUploadDir = parentUploadDir + "/" + docTypeId;
			log.info("parentUploadDir {} : ", parentUploadDir);
			log.info("childUploadDir {} : ", childUploadDir);
			// String filePath = uploadDir + File.separator + fileName;

			Path parentUploadpath = Paths.get(parentUploadDir);
			 Path childUploadpath = Paths.get(childUploadDir);
			 log.info("parentUploadpath {}", parentUploadpath);
			 log.info("childUploadpath {}", childUploadpath);
			if (!Files.exists(parentUploadpath)) {
				log.info("creating parent folder");
				Files.createDirectories(parentUploadpath);
				log.info("created parent folder");
			}
			if (!Files.exists(childUploadpath)) {
				log.info("creating child folder");
				Files.createDirectories(childUploadpath);
				log.info("created child folder");
			}

			try (InputStream inputStream = file.getInputStream()) {
				 Path filePath = childUploadpath.resolve(fileName);
				Resource resource = new UrlResource(filePath.toUri());
				String actualFilePath = resource.getURL().toString();
				//Path filePath = parentUploadpath.resolve(fileName);
				log.info("filePath {}:", filePath);
				saveUploadDetails(docTypeId, docType, docName, hospitalId, uploadDocumentDomain, fileName, actualFilePath);
				Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
			} catch (IOException e) {
				if (e instanceof FileAlreadyExistsException) {
					throw new FileAlreadyExistsException(fileName);
				} else {
					log.error("Error occured while uploading file ", e);
					throw new IOException("could not save uploaded file : " + fileName);
				}
			}

		} catch (Exception e) {
			if (e instanceof FileAlreadyExistsException) {
				throw new RuntimeException("A file of that name already exists.");
			}

			throw new RuntimeException(e.getMessage());
		}

		return uploadDocumentDomain;
	}


	private void saveUploadDetails(int docTypeId, String docType, String docName, Integer hospitalId,
								   UploadDocument uploadDocumentDomain, String fileName, String actualFilePath) {
		uploadDocumentDomain.setDocTypeId(docTypeId);
		uploadDocumentDomain.setDocType(docType);
		uploadDocumentDomain.setDocName(docName);
		uploadDocumentDomain.setDocNumber("");
	//	uploadDocumentDomain.setDocPath(getFileUri(docTypeId, docType, fileName));
		uploadDocumentDomain.setDocPath(actualFilePath);
		uploadDocumentDomain.setVerifyStatus(MasterConstant.NO);
		uploadDocumentDomain.setHospitalId(hospitalId);
		uploadDocumentRepo.save(uploadDocumentDomain);
	}
	
	public Stream<Path> loadAll(int docId, String userId) {
		try {
			String folderPath = uploadFilePath + "/" + docId + "/" + userId;
			Path root = Paths.get(folderPath);
			if (Files.exists(root)) {
				//Path root = Paths.get(folderPath);
				log.info("loadAll root {}", root.toString());
				Stream<Path> map = Files.walk(root, 1).filter(path -> !path.equals(root)).map(root::relativize);
				return map;
			} else {
				return null;
			}
		} catch (IOException e) {
			throw new RuntimeException("Could not load the files!");
		}
	}

	public Resource load(int docTypeId, String docType, String filename) {
		try {
			log.info("load() filename {}:", filename);
			String folderPath = uploadFilePath + "/" + docType + "/" + docTypeId;
			Path root = Paths.get(folderPath);
			Path file = root.resolve(filename);
			log.info("load(): file {}", file);
			Resource resource = new UrlResource(file.toUri());
			log.info("load(): resource {}", file);
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Error: " + e.getMessage());
		}
	}

	public void deleteAll() {
		Path root = Paths.get(uploadFilePath);
		FileSystemUtils.deleteRecursively(root.toFile());
	}

	public List<FileInfo> getTaskListFiles() {
		  log.info("inside getTaskListFiles");
		  List<File> fileList = new ArrayList<>();
		  File sourceFilePath = new File(uploadFilePath);
		  List<FileInfo> fileDomainList = new ArrayList<>();
		  for(String file : sourceFilePath.list()) {
			  FileInfo fileDomain = new FileInfo();
			 String url =  uploadFilePath + "/" + file;
			  String filePath = sourceFilePath.getAbsolutePath() + File.separator + file;
			  fileDomain.setName(filePath);  
			  File sourceFile = new File(filePath);
			  fileList.add(sourceFile);
			  fileDomainList.add(fileDomain);
		  }
		  log.info("fileList {}",fileList);
		return fileDomainList;
	}



	public void deleteFile(Integer docId, String docType, String fileName, Integer docTypeId) {
		log.info("UploadDocumentService : deleteFile() start for fileName {}:", fileName);
		Path fileDir = Paths.get(uploadFilePath + "/" + docType + "/" + docTypeId);
		log.info("uploadDir {} : ", fileDir);
		try {
			Path filePath = fileDir.resolve(fileName);
			if (Files.exists(filePath)) {
				Files.delete(filePath);
				uploadDocumentRepo.deleteByDocId(docId);
				log.info("File deleted successfully {} :", fileName);
			}else {
				throw new MasterManagerException("File already deleted " + fileName);
			}
		} catch (Exception e) {
			if(e.getMessage().equals("File already deleted " + fileName)) {
				throw new MasterManagerException("File already deleted " + fileName);
			}
			throw new MasterManagerException("Error occured while deleting file " + fileName);
		}
	}
	
/*
	private String getFileUri(int docTypeId, String docType, String fileName) {
		return MvcUriComponentsBuilder
				.fromMethodName(UploadDocumentController.class, "getFile", docTypeId, docType,
						fileName)
				.host(CommonUtility.getIpAddress().getHostAddress())
				.build().toString();
	}
*/

	public MasterManagerResponse getUploadDetails(UploadDocument reqDomain) {
		log.info("UploadDocumentService : getUploadDetails() started reqDomain {}", reqDomain);
		try {
			List<UploadDocument> uploadDocDetails = uploadDocumentRepo.findAllByHospitalId(UserContext.getHospitalId());
			return new MasterManagerResponse(MasterConstant.SUCCESS, uploadDocDetails);
		} catch (Exception e) {
			log.error("UploadDocumentService : getUploadDetails() Exception occured while fetching user details", e);
			throw new MasterManagerException(MasterConstant.SYSTEM_ERROR_MSG, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
