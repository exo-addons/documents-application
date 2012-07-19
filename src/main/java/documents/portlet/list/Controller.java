package documents.portlet.list;

import documents.ChromatticService;
import documents.DocumentsService;
import juzu.Action;
import juzu.Path;
import juzu.SessionScoped;
import juzu.View;
import juzu.template.Template;
import org.chromattic.ext.ntdef.NTFile;
import org.chromattic.ext.ntdef.NTHierarchyNode;

import javax.inject.Inject;
import java.io.IOException;
import java.text.ParseException;
import java.util.Collection;
import java.util.Map;

/** @author <a href="mailto:benjamin.paillereau@exoplatform.com">Benjamin Paillereau</a> */
@SessionScoped
public class Controller extends juzu.Controller
{

  /** . */
  @Inject
  @Path("index.gtmpl")
  Template indexTemplate;

  DocumentsService documentsService_;

  @Inject
  public Controller(ChromatticService chromatticService, DocumentsService documentsService)
  {
    documentsService_ = documentsService;
    documentsService_.initChromattic(chromatticService.init());
  }

  @View
  public void index() throws IOException
  {
    indexTemplate.with().set("files", documentsService_.getFiles()).render();
  }

  @Action
  public void updateData() throws ParseException
  {
    Map<String, String[]> params = actionContext.getParameters();
  }

}
