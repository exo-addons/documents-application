package documents.portlet.list;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@WebServlet(urlPatterns={"/uploadServlet"})
public class UploadServlet extends HttpServlet
{

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
  {
    System.out.println("UPLOAD GET");
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
  {
    try
    {
      List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
      for (FileItem item : items)
      {
        if (item.getFieldName().equals("file"))
        {
          String filename = FilenameUtils.getName(item.getName());
          InputStream content = item.getInputStream();

          System.out.println("UPLOAD POST : "+filename);

          response.setContentType("text/plain");
          response.setCharacterEncoding("UTF-8");
          response.getWriter().write("File " + filename + " successfully uploaded");
          return;
        }
      }
    }
    catch (FileUploadException e)
    {
      throw new ServletException("Parsing file upload failed.", e);
    }
  }

}