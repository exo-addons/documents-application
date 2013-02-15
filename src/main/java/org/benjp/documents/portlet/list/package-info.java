@Application(defaultController = org.benjp.documents.portlet.list.controllers.DocumentsApplication.class)
@Portlet
@Bindings(
        {
                @Binding(value = org.exoplatform.services.jcr.RepositoryService.class),
                @Binding(value = org.exoplatform.services.jcr.ext.app.SessionProviderService.class),
                @Binding(value = org.exoplatform.services.cms.folksonomy.NewFolksonomyService.class),
                @Binding(value = org.exoplatform.services.cms.link.LinkManager.class),
                @Binding(value = org.exoplatform.services.jcr.ext.hierarchy.NodeHierarchyCreator.class)
        }

)

@Assets(
        location = AssetLocation.SERVER,
        scripts = {
                @Script(src = "js/jquery-1.7.1.min.js", id = "jquery"),
                @Script(src = "js/jquery.filedrop.js", depends = "jquery", id = "filedrop"),
                @Script(src = "js/jquery.form.js", depends = "jquery", id = "jqform"),
                @Script(src = "js/bootstrap.min.js", id="bootstrap"),
                @Script(src = "js/mustache.js", id="mustache"),
                @Script(src = "js/taffy-min.js", id="taffy"),
                @Script(src = "js/main.js", depends = "jquery, filedrop, jqform, bootstrap, mustache, taffy")
        },
        stylesheets = {
                @Stylesheet(src = "css/bootstrap.min.css"),
                @Stylesheet(src = "css/bootstrap-modal-fix.css"),
                @Stylesheet(src = "documents.css", location = AssetLocation.CLASSPATH)
        }
)

@Less(value = "documents.less", minify = true)

package org.benjp.documents.portlet.list;

import juzu.Application;
import juzu.asset.AssetLocation;
import juzu.plugin.asset.Assets;
import juzu.plugin.asset.Script;
import juzu.plugin.asset.Stylesheet;
import juzu.plugin.binding.Binding;
import juzu.plugin.binding.Bindings;
import juzu.plugin.less.Less;
import juzu.plugin.portlet.Portlet;
import org.benjp.provider.GateInMetaProvider;

