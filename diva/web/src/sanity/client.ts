import {createClient} from "next-sanity";
import type {} from "../../sanity.types";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-11-15",
  useCdn: false,
});
