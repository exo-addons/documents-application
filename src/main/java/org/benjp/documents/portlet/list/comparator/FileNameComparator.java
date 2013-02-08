package org.benjp.documents.portlet.list.comparator;

import org.benjp.documents.portlet.list.bean.File;

import java.util.Comparator;

/**
 * Created with IntelliJ IDEA.
 * User: benjamin
 * Date: 08/02/13
 * Time: 17:00
 * To change this template use File | Settings | File Templates.
 */
public class FileNameComparator implements Comparator<File> {
  public int compare(File file, File file2) {
    return file.compareTo(file2);
  }
}
