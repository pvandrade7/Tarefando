import { createClient } from "@supabase/supabase-js";

const URL = 'https://maabuunznbgbtwwutpur.supabase.co';
const KEY = 'sb_publishable_A24tXJeelNI49tVcLmBk3g_f8ze8PmH';

export const supabase = createClient(URL, KEY);