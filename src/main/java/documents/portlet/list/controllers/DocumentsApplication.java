package documents.portlet.list.controllers;

import documents.ChromatticService;
import documents.DocumentsService;
import juzu.Path;
import juzu.SessionScoped;
import juzu.View;
import juzu.template.Template;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator;

import javax.inject.Inject;
import java.io.IOException;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class DocumentsApplication extends juzu.Controller
{

  /** . */
  @Inject
  @Path("index.gtmpl")
  Template indexTemplate;

  @Inject
  @Path("status.gtmpl")
  Template statusTemplate;

  DocumentsService documentsService_;

  String userPrivatePath;

  @Inject
  public DocumentsApplication(ChromatticService chromatticService, DocumentsService documentsService, RepositoryService repositoryService, NodeHierarchyCreator nodeHierarchyCreator)
  {
    documentsService_ = documentsService;
    documentsService_.initChromattic(chromatticService.init());

  }

  @View
  public void index() throws IOException
  {
    System.out.println("Documents List : INDEX");
    indexTemplate.with().set("files", documentsService_.getFiles()).render();
  }

}
