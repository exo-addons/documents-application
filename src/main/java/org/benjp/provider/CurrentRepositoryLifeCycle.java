/*
 * Copyright (C) 2010 eXo Platform SAS.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

package org.benjp.provider;

import org.chromattic.spi.jcr.SessionLifeCycle;

import javax.jcr.Credentials;
import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.lang.reflect.Method;

/**
 * Integrates Chromattic with the GateIn JCR server. 
 *
 * @author <a href="mailto:julien.viet@exoplatform.com">Julien Viet</a>
 * @version $Revision$
 */
public class CurrentRepositoryLifeCycle implements SessionLifeCycle
{

   /** . */
   private final String containerName = "portal";

   private Repository getCurrentRepository() throws RepositoryException
   {
      try
      {
         ClassLoader cl = Thread.currentThread().getContextClassLoader();

         // Get top container
         Class<?> eXoContainerContextClass = cl.loadClass("org.exoplatform.container.ExoContainerContext");
         Method getTopContainerMethod = eXoContainerContextClass.getMethod("getTopContainer");
         Object topContainer = getTopContainerMethod.invoke(null);

         //
         if (topContainer == null)
         {
            throw new RepositoryException("Could not locate the top container");
         }

         //
         Method getPortalContainerMethod = topContainer.getClass().getMethod("getPortalContainer", String.class);
         Object container = getPortalContainerMethod.invoke(topContainer, containerName);

         //
         if (container == null)
         {
            throw new RepositoryException("Could not obtain the " + containerName + " portal container");
         }

         //
         Method getComponentInstanceOfTypeMethod = container.getClass().getMethod("getComponentInstanceOfType", Class.class);
         Class<?> repositoryServiceClass = Thread.currentThread().getContextClassLoader().loadClass("org.exoplatform.services.jcr.RepositoryService");
         Object repositoryService = getComponentInstanceOfTypeMethod.invoke(container, repositoryServiceClass);

         //
         if (repositoryService == null)
         {
            throw new RepositoryException("Could not obtain the repository service");
         }

         //
         Method getDefaultRepositoryMethod = repositoryService.getClass().getMethod("getCurrentRepository");
         return (Repository)getDefaultRepositoryMethod.invoke(repositoryService);
      }
      catch (Exception e)
      {
         throw new RepositoryException("Could not obtain repository", e);
      }
   }

   public Session login() throws RepositoryException
   {
      Repository repo = getCurrentRepository();
      return repo.login();
   }

   public Session login(String workspace) throws RepositoryException
   {
      Repository repo = getCurrentRepository();
      return repo.login(workspace);
   }

   public Session login(Credentials credentials, String workspace) throws RepositoryException
   {
      Repository repo = getCurrentRepository();
      return repo.login(credentials, workspace);
   }

   public Session login(Credentials credentials) throws RepositoryException
   {
      Repository repo = getCurrentRepository();
      return repo.login(credentials);
   }

   public void save(Session session) throws RepositoryException
   {
      session.save();
   }

   public void close(Session session)
   {
      session.logout();
   }
}
