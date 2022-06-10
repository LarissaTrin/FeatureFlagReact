import { AppConfigurationClient } from "@azure/app-configuration";
import { useMemo, useState } from "react";

// create a .env file in the root of your project and add the following line:
// REACT_APP_APPCONFIG_CONNECTION_STRING=<your read-only connection string>
const client = new AppConfigurationClient(
  process.env.REACT_APP_APPCONFIG_CONNECTION_STRING
);

/**
 * Retrieves the specified feature flag from Azure App Configuration.
 * @param {string} flagKey App Config Feature Flag key
 * @returns a boolean for the specified key
 */
const useFeatureFlag = (flagKey = "") => {
  const [enabled, setEnabled] = useState(false);

  useMemo(() => {
    const getConfig = async () => {
      const result = await client
        .getConfigurationSetting({
          key: `.appconfig.featureflag/${flagKey}`,
        })
        .catch((_) => {
          console.error(
            `Unable to retrieve the "${flagKey}" feature flag from Azure App Configuration.`
          );
        });

      if (result && typeof result === "object") {
        setEnabled(JSON.parse(result.value).enabled);
      }
    };

    getConfig();
  }, [flagKey]);

  return enabled;
};

/**
 * Retrieves and parses the specified configuration from Azure App Configuration.
 * @param {string} configKey App Config Key
 * @returns the configuration for the specified key
 */
const useConfiguration = (configKey = "") => {
  const [config, setConfig] = useState("");

  useMemo(() => {
    const getConfig = async () => {
      const result = await client
        .getConfigurationSetting({
          key: configKey,
        })
        .catch((_) => {
          console.error(
            `Unable to retrieve the "${configKey}" configuration from Azure App Configuration.`
          );
        });

      if (result) {
        setConfig(result.value);
      }
    };

    getConfig();
  }, [configKey]);

  return config;
};

export { useFeatureFlag, useConfiguration };
