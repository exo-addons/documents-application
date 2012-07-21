package documents.portlet.list;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.exoplatform.container.PortalContainer;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.common.SessionProvider;
import org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;

public class UploadServlet extends HttpServlet
{

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
          storeFile(item, request.getRemoteUser());

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

  private void storeFile(FileItem item, String userName)
  {
    String filename = FilenameUtils.getName(item.getName());
    RepositoryService repositoryService = (RepositoryService)PortalContainer.getInstance().getComponentInstanceOfType(RepositoryService.class);
    NodeHierarchyCreator nodeHierarchyCreator = (NodeHierarchyCreator)PortalContainer.getInstance().getComponentInstanceOfType(NodeHierarchyCreator.class);


    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService.getCurrentRepository());

      Node userNode = nodeHierarchyCreator.getUserNode(sessionProvider, userName);
      Node homeNode = userNode.getNode("Private");

      Node docNode = homeNode.getNode("Documents");
      if (isImage(filename))
        docNode = homeNode.getNode("Pictures");

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
      System.out.println("JCR::" + e.getMessage());
    }
    finally
    {
      sessionProvider.close();
    }
  }

  private boolean isImage(String filename)
  {
    if (filename.endsWith(".jpg") || filename.endsWith(".png"))
      return true;
    return false;
  }

}