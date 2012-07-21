package documents.portlet.list;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.exoplatform.container.PortalContainer;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.common.SessionProvider;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.List;

//@WebServlet(urlPatterns={"/uploadServlet"})
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
        if (item.getFieldName().equals("pic"))
        {

          storeFile(item);

          response.setContentType("application/json");
          response.setCharacterEncoding("UTF-8");
          response.getWriter().write("{\"status\":\"File was uploaded successfuly!\"}");
          return;
        }
      }
    }
    catch (FileUploadException e)
    {
      throw new ServletException("Parsing file upload failed.", e);
    }
  }

  private void storeFile(FileItem item)
  {
    String filename = FilenameUtils.getName(item.getName());
    RepositoryService repositoryService = (RepositoryService)PortalContainer.getInstance().getComponentInstanceOfType(RepositoryService.class);
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService.getCurrentRepository());


      Node rootNode = session.getRootNode();
      Node docNode = rootNode.getNode("Documents");
      if (!docNode.hasNode(filename))
      {
        Node fileNode = docNode.addNode(filename, "nt:file");
        Node jcrContent = fileNode.addNode("jcr:content", "nt:resource");
        jcrContent.setProperty("jcr:data", item.getInputStream());
        jcrContent.setProperty("jcr:lastModified", Calendar.getInstance());
        jcrContent.setProperty("jcr:encoding", "UTF-8");
        if (filename.endsWith(".jpg"))
          jcrContent.setProperty("jcr:mimeType", "image/jpeg");
        else if (filename.endsWith(".png"))
          jcrContent.setProperty("jcr:mimeType", "image/png");
        else if (filename.endsWith(".pdf"))
          jcrContent.setProperty("jcr:mimeType", "application/pdf");
        docNode.save();
        session.save();
      }


    }
    catch (Exception e)
    {
      System.out.println("JCR::\n" + e.getMessage());
    }
    finally
    {
      sessionProvider.close();
    }
  }

}