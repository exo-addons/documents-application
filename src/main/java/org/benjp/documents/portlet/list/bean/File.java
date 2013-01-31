package org.benjp.documents.portlet.list.bean;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;

public class File {
  String name;
  Calendar createdDate;
  String icon;
  String preview;
  String size;
  String path;
  String uuid;
  String publicUrl;
  List<String> tags;
  String version;
  List<VersionBean> versionBeans;
  boolean isFile=true;


  public void setAsFolder()
  {
    this.isFile = false;
  }

  public boolean isFile() {
    return isFile;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCreatedDate() {
    SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy");
    return formatter.format(createdDate.getTime());
  }

  public void setCreatedDate(Calendar createdDate) {
    this.createdDate = createdDate;
  }

  public String getIcon() {
    if (name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".xls")
            || name.endsWith(".xlsx") || name.endsWith(".ppt") || name.endsWith(".pptx")
            || name.endsWith(".odt") || name.endsWith(".ods") || name.endsWith(".odp"))
      return "/portal/rest/pdfviewer/repository/collaboration/1/0.0/0.25/"+getUuid();
//      return "/documents/img/Files-text.png";
    else if (!isFile())
      return "/documents/img/Files-folder.png";
     else
      return "/rest/thumbnailImage/custom/32x32/repository/collaboration"+path;
  }

  public String getPreview() {
    if (name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx") || name.endsWith(".xls")
            || name.endsWith(".xlsx") || name.endsWith(".ppt") || name.endsWith(".pptx")
            || name.endsWith(".odt") || name.endsWith(".ods") || name.endsWith(".odp"))
      return "/portal/rest/pdfviewer/repository/collaboration/1/0.0/1.0/"+getUuid();
//      return "/documents/img/Files-text.png";
    else if (!isFile())
      return "/documents/img/Files-folder-big.png";
    else
      return "/rest/thumbnailImage/custom/550x0/repository/collaboration"+path;
  }

  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public String getPath() {
    return "/rest/jcr/repository/collaboration"+path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  public String getPublicUrl() {
    return publicUrl;
  }

  public void setPublicUrl(String publicUrl) {
    this.publicUrl = publicUrl;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public String getTagsAsString() {
    StringBuffer sb = new StringBuffer();
    boolean first=true;
    for (String tag:tags)
    {
      sb.append( (first)?"":", " ).append(tag);
      first=false;
    }
    return sb.toString();
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public List<VersionBean> getVersions() {
    return versionBeans;
  }

  public void setVersions(List<VersionBean> versionBeans) {
    this.versionBeans = versionBeans;
    if (this.versionBeans.size()>1) Collections.sort(this.versionBeans, Collections.reverseOrder());
  }
}
