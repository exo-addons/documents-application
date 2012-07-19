package documents;

import org.chromattic.api.Chromattic;
import org.chromattic.api.ChromatticBuilder;
import org.chromattic.ext.ntdef.NTFolder;
import org.chromattic.ext.ntdef.NTHierarchyNode;
import org.exoplatform.services.jcr.RepositoryService;
import org.exoplatform.services.jcr.core.nodetype.ExtendedNodeTypeManager;
import org.exoplatform.services.jcr.ext.common.SessionProvider;
import org.exoplatform.services.jcr.impl.core.ExtendedNamespaceRegistry;
import documents.integration.CurrentRepositoryLifeCycle;

import javax.inject.Inject;
import javax.jcr.Session;
import java.io.InputStream;

public class ChromatticService {

  Chromattic chromattic;

  @Inject
  public ChromatticService()
  {
  }

  public Chromattic init()
  {

    ChromatticBuilder builder = ChromatticBuilder.create();
    builder.add(NTFolder.class);
    builder.add(NTHierarchyNode.class);

    builder.setOptionValue(ChromatticBuilder.SESSION_LIFECYCLE_CLASSNAME, CurrentRepositoryLifeCycle.class.getName());
    builder.setOptionValue(ChromatticBuilder.CREATE_ROOT_NODE, true);
    builder.setOptionValue(ChromatticBuilder.ROOT_NODE_PATH, "/");

    chromattic = builder.build();

    return chromattic;
  }


}
