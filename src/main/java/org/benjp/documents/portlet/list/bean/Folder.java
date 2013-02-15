package org.benjp.documents.portlet.list.bean;


import java.util.List;

public class Folder {
  List<File> files;
  String path;
  String filter;
  Long timestamp;

  public List<File> getFiles() {
    return files;
  }

  public void setFiles(List<File> files) {
    this.files = files;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Long getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Long timestamp) {
    this.timestamp = timestamp;
  }

  public String getFilter() {
    return filter;
  }

  public void setFilter(String filter) {
    this.filter = filter;
  }

  public String filesToJSON()
  {
    StringBuffer sb = new StringBuffer();
    sb.append("{");
    sb.append("\"timestamp\": \""+this.getTimestamp()+"\",");
    sb.append("\"path\": \""+this.getPath()+"\",");
    sb.append("\"filter\": \""+this.getFilter()+"\",");
    sb.append("\"hasData\": true,");
    sb.append("\"files\": [");
    boolean first=true;
    for (File file:this.getFiles()) {
      if (!first) {
        sb.append(",");
      } else {
        first=false;
      }

      sb.append(file.toJSON());

    }
    sb.append("]}");


    return sb.toString();
  }

}
