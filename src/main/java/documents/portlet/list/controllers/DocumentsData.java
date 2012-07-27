package documents.portlet.list.controllers;


import documents.portlet.list.bean.File;
import documents.portlet.list.controllers.validator.NameValidator;
import juzu.SessionScoped;
import org.exoplatform.portal.webui.util.Util;
import org.exoplatform.services.cms.folksonomy.NewFolksonomyService;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.common.SessionProvider;
import org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.servlet.http.HttpServletRequest;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@Named("documentsData")
@SessionScoped
public class DocumentsData {

  RepositoryService repositoryService_;

  NewFolksonomyService newFolksonomyService_;

  NodeHierarchyCreator nodeHierarchyCreator_;

  public static final String TYPE_DOCUMENT="Documents";
  public static final String TYPE_IMAGE="Pictures";

  @Inject
  public DocumentsData(RepositoryService repositoryService, NodeHierarchyCreator nodeHierarchyCreator, NewFolksonomyService newFolksonomyService)
  {
    repositoryService_ = repositoryService;
    nodeHierarchyCreator_= nodeHierarchyCreator;
    newFolksonomyService_ = newFolksonomyService;
  }


  protected List<File> getNodes(String type)
  {
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());


      Node rootNode = session.getRootNode();
      Node docNode = rootNode.getNode(getUserPrivatePath()+"/"+type);

      NodeIterator nodes = docNode.getNodes();
      List<File> files = new ArrayList<File>();
      while (nodes.hasNext())
      {
        Node node = nodes.nextNode();
        if (isAcceptedFile(node.getName()))
        {
          File file = new File();
          //set name
          file.setName(node.getName());
          //set uuid
          file.setUuid(node.getUUID());
          // set creted date
          file.setCreatedDate(node.getProperty("exo:dateCreated").getDate());
          //set file size
          if (node.hasNode("jcr:content")) {
            Node contentNode = node.getNode("jcr:content");
            if (contentNode.hasProperty("jcr:data")) {
              double size = contentNode.getProperty("jcr:data").getLength();
              String fileSize = calculateFileSize(size);
              file.setSize(fileSize);
            }
          }
          // set path
          file.setPath(node.getPath());
          // set public url
          HttpServletRequest request = Util.getPortalRequestContext().getRequest();
          String baseURI = request.getScheme() + "://" + request.getServerName() + ":"
                  + String.format("%s", request.getServerPort());

          String url = baseURI+"/documents/file/"+Util.getPortalRequestContext().getRemoteUser()+"/"+file.getUuid()+"/"+file.getName();
          file.setPublicUrl(url);

          //set tags
          List<Node> tags = newFolksonomyService_.getLinkedTagsOfDocumentByScope(NewFolksonomyService.PRIVATE,
                  Util.getPortalRequestContext().getRemoteUser(),
                  node, "collaboration");
          List<String> stags = new ArrayList<String>();
          if (tags!=null && tags.size()>0)
          {

            for (Node tag:tags)
            {
              stags.add(tag.getName());
            }
          }
          file.setTags(stags);

          files.add(file);
        }
      }

      return files;

    }
    catch (Exception e)
    {
      System.out.println("JCR::\n" + e.getMessage());
    }
    finally
    {
      sessionProvider.close();
    }
    return null;
  }

  protected void deleteFile(String uuid) throws Exception
  {
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());
      session.getNodeByUUID(uuid).remove();
      session.save();
    }
    finally
    {
      sessionProvider.close();
    }

  }

  protected void renameFile(String uuid, String name) throws Exception
  {
    NameValidator.validateName(name);
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());
      Node node = session.getNodeByUUID(uuid);
      String extension = node.getName().substring(node.getName().lastIndexOf("."));
      StringBuilder newPath = new StringBuilder(node.getParent().getPath()).append('/')
              .append(name).append(extension);
      session.move(node.getPath(), newPath.toString());
      session.save();
    }
    finally
    {
      sessionProvider.close();
    }

  }

  protected void editTags(String uuid, String tags) throws Exception
  {
    if (tags==null || "".equals(tags)) throw new IllegalArgumentException("Tags list must be non-null and non-empty");
    String tagsPath = "/"+getUserPrivatePath()+"/Folksonomy/";

    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());
      Node node = session.getNodeByUUID(uuid);

      String[] atags = tags.replaceAll(" ", "").toLowerCase().split(",");


      /**
       * TODO : Remove existing if not in new list, add only if new
       * */
      List<Node> tagsNodes = newFolksonomyService_.getLinkedTagsOfDocumentByScope(NewFolksonomyService.PRIVATE,
              Util.getPortalRequestContext().getRemoteUser(),
              node, "collaboration");
      if (tagsNodes!=null && tagsNodes.size()>0)
      {
        for (Node tag:tagsNodes)
        {
          newFolksonomyService_.removeTagOfDocument(tagsPath+tag.getName(), node, "collaboration");
        }
      }


      newFolksonomyService_.addPrivateTag(atags, node, "collaboration", Util.getPortalRequestContext().getRemoteUser());

      session.save();
    }
    finally
    {
      sessionProvider.close();
    }

  }

  private String getUserPrivatePath()
  {
    String userName = Util.getPortalRequestContext().getRemoteUser();

    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      Node userNode = nodeHierarchyCreator_.getUserNode(sessionProvider, userName);
      return userNode.getPath().substring(1)+"/Private";
    }
    catch (Exception e)
    {
      System.out.println("JCR::" + e.getMessage());
    }
    finally
    {
      sessionProvider.close();
    }

    return null;
  }

  public static String calculateFileSize(double fileLengthLong) {
    int fileLengthDigitCount = Double.toString(fileLengthLong).length();
    double fileSizeKB = 0.0;
    String howBig = "";
    if (fileLengthDigitCount < 5) {
      fileSizeKB = Math.abs(fileLengthLong);
      howBig = "Byte(s)";
    } else if (fileLengthDigitCount >= 5 && fileLengthDigitCount <= 6) {
      fileSizeKB = Math.abs((fileLengthLong / 1024));
      howBig = "KB";
    } else if (fileLengthDigitCount >= 7 && fileLengthDigitCount <= 9) {
      fileSizeKB = Math.abs(fileLengthLong / (1024 * 1024));
      howBig = "MB";
    } else if (fileLengthDigitCount > 9) {
      fileSizeKB = Math.abs((fileLengthLong / (1024 * 1024 * 1024)));
      howBig = "GB";
    }
    String finalResult = roundTwoDecimals(fileSizeKB);
    return finalResult + " " + howBig;
  }

  private static String roundTwoDecimals(double d) {
    DecimalFormat twoDForm = new DecimalFormat("#.##");
    return twoDForm.format(d);
  }

  private boolean isAcceptedFile(String filename)
  {
    if (filename.endsWith(".jpg") || filename.endsWith(".png") || filename.endsWith(".pdf"))
      return true;
    return false;
  }


}
