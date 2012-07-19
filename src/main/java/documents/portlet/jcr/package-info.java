@Bindings(
        @Binding(value = org.exoplatform.services.jcr.RepositoryService.class, implementation=GateInMetaProvider.class)
)

@Assets(
        scripts = {
                @Script(src = "js/jquery-1.7.1.min.js")
        },
        stylesheets = {
                @Stylesheet(src = "css/bootstrap.css"),
                @Stylesheet(src = "css/bootstrap-responsive.css"),
                @Stylesheet(src = "css/main.css")
        }
)

@Application
@Portlet package documents.portlet.jcr;

import juzu.Application;
import juzu.plugin.asset.Assets;
import juzu.plugin.asset.Script;
import juzu.plugin.asset.Stylesheet;
import juzu.plugin.binding.Binding;
import juzu.plugin.binding.Bindings;
import juzu.plugin.portlet.Portlet;
import documents.integration.GateInMetaProvider;

