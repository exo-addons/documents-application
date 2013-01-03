package org.benjp.provider;

import juzu.inject.ProviderFactory;
import org.exoplatform.container.PortalContainer;

import javax.inject.Provider;

/** @author <a href="mailto:julien.viet@exoplatform.com">Julien Viet</a> */
public class GateInMetaProvider implements ProviderFactory
{
   public <T> Provider<? extends T> getProvider(final Class<T> implementationType)
   {
      return new Provider<T>() {
         public T get() {
            @SuppressWarnings("unchecked")
            T ret = (T)PortalContainer.getComponent(implementationType);
            return ret;
         }
      };
   }
}
