@Application(defaultController = documents.portlet.list.controllers.DocumentsApplication.class)
@Portlet
@Bindings(
        {
                @Binding(value = org.exoplatform.services.jcr.RepositoryService.class, implementation=GateInMetaProvider.class),
                @Binding(value = org.exoplatform.services.cms.folksonomy.NewFolksonomyService.class, implementation=GateInMetaProvider.class),
                @Binding(value = org.exoplatform.services.cms.link.LinkManager.class, implementation=GateInMetaProvider.class),
                @Binding(value = org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator.class, implementation=GateInMetaProvider.class)
        }

)

@Assets(
        scripts = {
                @Script(src = "js/jquery-1.7.1.min.js"),
                @Script(src = "js/jquery.filedrop.js"),
                @Script(src = "js/bootstrap-button.js"),
                @Script(src = "js/bootstrap-modal.js"),
                @Script(src = "js/bootstrap-dropdown.js"),
                @Script(src = "js/main.js")
        },
        stylesheets = {
                @Stylesheet(src = "css/bootstrap.css"),
                @Stylesheet(src = "css/bootstrap-responsive.css"),
                @Stylesheet(src = "css/bootstrap-modal-fix.css"),
                @Stylesheet(src = "css/main.css")
        }
)

package documents.portlet.list;

import juzu.Application;
import juzu.plugin.asset.Assets;
import juzu.plugin.asset.Script;
import juzu.plugin.asset.Stylesheet;
import juzu.plugin.binding.Binding;
import juzu.plugin.binding.Bindings;
import juzu.plugin.portlet.Portlet;
import documents.integration.GateInMetaProvider;

