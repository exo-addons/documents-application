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

  @Inject
  public DocumentsData(RepositoryService repositoryService, NodeHierarchyCreator nodeHierarchyCreator)
  {
    repositoryService_ = repositoryService;
    nodeHierarchyCreator_= nodeHierarchyCreator;
  }


  protected NodeIterator getNodes()
  {
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());


      Node rootNode = session.getRootNode();
      Node docNode = rootNode.getNode(getUserPrivatePath());

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
      return userNode.getPath().substring(1)+"/Private"+"/Documents";
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
