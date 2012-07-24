package documents.portlet.list.controllers;

import juzu.Path;
import juzu.SessionScoped;
import juzu.View;
import juzu.template.Template;

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
  DocumentsData documentsData;

  @View
  public void index() throws IOException
  {
    indexTemplate.with().set("files", documentsData.getNodes(DocumentsData.Type.DOCUMENT)).render();
  }




}
