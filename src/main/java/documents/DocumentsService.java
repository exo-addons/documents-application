package documents;

import org.chromattic.api.Chromattic;
import org.chromattic.api.ChromatticSession;
import org.chromattic.ext.ntdef.NTFolder;
import org.chromattic.ext.ntdef.NTHierarchyNode;
import org.exoplatform.container.PortalContainer;
import org.exoplatform.portal.webui.util.Util;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.common.SessionProvider;
import org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator;

import javax.jcr.Node;
import javax.jcr.Session;
import java.util.Collection;

public class DocumentsService {

  Chromattic chromattic_;

  public void initChromattic(Chromattic chromattic)
  {
    chromattic_ = chromattic;
  }


  public Collection<NTHierarchyNode> getFiles()
  {
    String username = Util.getPortalRequestContext().getRemoteUser();
    if (username!=null)
    {
      ChromatticSession session = chromattic_.openSession("collaboration");
      try
      {
//        NTFolder documents = session.findByPath(NTFolder.class, "documents");
        String userPrivatePath = getUserPrivatePath();
        System.out.println("UPP="+userPrivatePath);
        NTFolder documents = session.findByPath(NTFolder.class, userPrivatePath);
//        if (documents==null)
//        {
//          documents = session.insert(NTFolder.class, "documents");
//          session.save();
//        }

        if (documents!=null && documents.getChildren()!=null)
        {
          return documents.getChildren().values();
        }
      }
      finally
      {
        session.close();
      }
    }

    return null;
  }

  public String getUserPrivatePath()
  {
    RepositoryService repositoryService = (RepositoryService) PortalContainer.getInstance().getComponentInstanceOfType(RepositoryService.class);
    NodeHierarchyCreator nodeHierarchyCreator = (NodeHierarchyCreator)PortalContainer.getInstance().getComponentInstanceOfType(NodeHierarchyCreator.class);
    String userName = Util.getPortalRequestContext().getRemoteUser();


    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService.getCurrentRepository());

      Node userNode =
              nodeHierarchyCreator.getUserNode(sessionProvider, userName);
      return userNode.getPath().substring(1)+"/Private"+"/Documents";

    }
    catch (Exception e)
    {
      System.out.println("JCR::" + e.getMessage());
      e.printStackTrace();
    }
    finally
    {
      sessionProvider.close();
    }

    return null;
  }

}
