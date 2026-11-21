import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const base = z.object({ title:z.string(), description:z.string(), date:z.coerce.date(), author:z.string().default('Equipe Prima Scriptura'), draft:z.boolean().default(false), tags:z.array(z.string()).default([]) });
const comentarios=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/comentarios'}),schema:base.extend({book:z.string(),testament:z.enum(['Antigo Testamento','Novo Testamento']),chapter:z.number().int().min(1),verses:z.string()})});
const estudos=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/estudos'}),schema:base.extend({category:z.string()})});
export const collections={comentarios,estudos};
