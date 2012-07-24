package documents.portlet.list.controllers;


import juzu.SessionScoped;
import org.exoplatform.portal.webui.util.Util;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.common.SessionProvider;
import org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator;

import javax.inject.Inject;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;

@Named("documentsData")
@SessionScoped
public class DocumentsData {

  RepositoryService repositoryService_;

  NodeHierarchyCreator nodeHierarchyCreator_;

  public enum Type { IMAGE, DOCUMENT}

  @Inject
  public DocumentsData(RepositoryService repositoryService, NodeHierarchyCreator nodeHierarchyCreator)
  {
    repositoryService_ = repositoryService;
    nodeHierarchyCreator_= nodeHierarchyCreator;
  }


  protected NodeIterator getNodes(Type type)
  {
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());


      Node rootNode = session.getRootNode();
      String docFolder;
      switch (type)
      {
        case DOCUMENT:
          docFolder = "/Documents";
          break;
        case IMAGE:
          docFolder = "/Images";
          break;
        default:
          docFolder = "/Documents";

      }
      Node docNode = rootNode.getNode(getUserPrivatePath()+docFolder);

      NodeIterator nodes = docNode.getNodes();

      return nodes;

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

}
