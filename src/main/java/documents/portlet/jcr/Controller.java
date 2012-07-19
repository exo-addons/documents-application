package documents.portlet.jcr;

import documents.ChromatticService;
import documents.DocumentsService;
import juzu.Action;
import juzu.Path;
import juzu.SessionScoped;
import juzu.View;
import juzu.template.Template;
import org.chromattic.ext.ntdef.NTFile;
import org.chromattic.ext.ntdef.NTHierarchyNode;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.core.nodetype.ExtendedNodeTypeManager;
import org.exoplatform.services.jcr.core.nodetype.NodeTypeValue;
import org.exoplatform.services.jcr.core.nodetype.PropertyDefinitionValue;
import org.exoplatform.services.jcr.ext.common.SessionProvider;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PropertyType;
import javax.jcr.Session;
import javax.jcr.version.OnParentVersionAction;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class Controller extends juzu.Controller
{

  /** . */
  @Inject
  @Path("index.gtmpl")
  Template indexTemplate;

  private RepositoryService repositoryService_;

  @Inject
  public Controller(RepositoryService repositoryService)
  {
    System.out.println("JCR INIT");
    repositoryService_ = repositoryService;
  }

  @View
  public void index() throws IOException
  {
    indexTemplate.with().set("files", getNodes()).render();
  }

  private NodeIterator getNodes()
  {
    SessionProvider sessionProvider = SessionProvider.createSystemProvider();
    try
    {
      //get info
      Session session = sessionProvider.getSession("collaboration", repositoryService_.getCurrentRepository());


      Node rootNode = session.getRootNode();
      Node docNode = rootNode.getNode("Documents");

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

}
