package documents;

import org.chromattic.api.Chromattic;
import org.chromattic.api.ChromatticSession;
import org.chromattic.ext.ntdef.NTFolder;
import org.chromattic.ext.ntdef.NTHierarchyNode;
import org.exoplatform.portal.webui.util.Util;

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
      ChromatticSession session = chromattic_.openSession("wcm-system");
      try
      {
        NTFolder documents = session.findByPath(NTFolder.class, "documents");
        if (documents==null)
        {
          documents = session.insert(NTFolder.class, "documents");
          session.save();
        }

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

}
