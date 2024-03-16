"use client";

import config from "@/amplifyconfiguration.json";
import { Amplify } from "aws-amplify";

Amplify.configure(config,
    { 
        ssr: true,
        API: {
            REST: {
                [config.custom.apiName]: {
                    endpoint: config.custom.apiEndpoint,
                    region: config.custom.apiRegion
                },
            }
        }
    });

export default function ConfigureAmplifyClientSide() {
    return null;
}