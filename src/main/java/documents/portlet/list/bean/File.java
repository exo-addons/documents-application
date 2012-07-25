package documents.portlet.list.bean;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class File {
  String name;
  Calendar createdDate;
  String icon;
  String size;
  String path;
  String uuid;
  String publicUrl;


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
    if (name.endsWith(".pdf"))
      return "/documents/img/Files-text.png";
    else
      return "/rest/thumbnailImage/custom/32x32/repository/collaboration"+path;
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
}
