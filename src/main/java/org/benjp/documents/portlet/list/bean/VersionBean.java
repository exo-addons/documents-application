package org.benjp.documents.portlet.list.bean;

import java.text.SimpleDateFormat;
import java.util.Date;

public class VersionBean implements Comparable<VersionBean>
{
  Date createdDate;
  String name;


  public String getCreatedDate() {
    SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy HH:mm:ss");
    return formatter.format(createdDate.getTime());
  }

  public void setCreatedDate(Date createdDate) {
    this.createdDate = createdDate;
  }

  public String getName() {
    return name;
  }

  public String getReadableName() {
    return ("jcr:rootVersion".equals(name))?"Base Version":name;
  }

  public boolean isRootVersion() {
    return "jcr:rootVersion".equals(name);
  }

  public void setName(String name) {
    this.name = name;
  }

  public int compareTo(VersionBean version) {
    return createdDate.compareTo(version.createdDate);
  }
}
