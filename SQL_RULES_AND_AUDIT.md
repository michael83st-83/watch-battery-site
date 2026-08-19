cat << 'EOF' > SQL_RULES_AND_AUDIT.md
# Watch Battery Database: SQL Rules Engine & Audit Ledger

**Last Updated:** August 13, 2026  
**Target Table:** `"Watch Batteries"`  
**Primary Function:** `enforce_horological_rules()`

---

## 1. Active Database Bouncer (`BEFORE INSERT OR UPDATE`)

This PL/pgSQL function runs automatically on Supabase every time a row is added or modified. It intercepts hallucinated AI data before it hits your live table.

```sql
CREATE OR REPLACE FUNCTION enforce_horological_rules()
RETURNS TRIGGER AS $$ BEGIN          -- RULE 1: Breitling Caliber Blind Spots (Always Automatic)     IF NEW.watch_query ILIKE '\%Breitling\%' AND (         NEW.watch_query ILIKE '\%A13\%' OR          NEW.watch_query ILIKE '\%B13\%' OR          NEW.watch_query ILIKE '\%A17\%' OR          NEW.watch_query ILIKE '\%A25\%'     ) THEN         NEW.power_type := 'automatic';         NEW.requires_battery := false;         NEW."Model Number" := 'N/A';     END IF;      -- RULE 2: Rolex Quartz Exceptions (Oysterquartz & Cellini Quartz)     IF NEW.watch_query ILIKE '\%oysterquartz\%' AND NEW.watch_query NOT ILIKE '\%1530\%' THEN         NEW.power_type := 'quartz';         NEW.requires_battery := true;         IF NEW."Model Number" = 'N/A' OR NEW."Model Number" IS NULL THEN             NEW."Model Number" := '357';         END IF;     ELSIF NEW.watch_query ILIKE '\%rolex\%' AND NEW.watch_query ILIKE '\%cellini\%' AND NEW.watch_query ILIKE '\%quartz\%' THEN         NEW.power_type := 'quartz';         NEW.requires_battery := true;         IF NEW."Model Number" = 'N/A' OR NEW."Model Number" IS NULL THEN             NEW."Model Number" := '397';         END IF;     END IF;      -- RULE 3: Known Quartz-Only Collections     IF NEW.watch_query ILIKE '\%Galactic 32\%' OR         NEW.watch_query ILIKE '\%Galactic 29\%' OR         NEW.watch_query ILIKE '\%Callistino\%' THEN         NEW.power_type := 'quartz';         NEW.requires_battery := true;                  IF NEW."Model Number" = 'N/A' OR NEW."Model Number" ILIKE 'B\%' THEN             NEW."Model Number" := 'Needs Review';         END IF;     END IF;      -- RULE 4: Universal Guardrail for Mechanical / Automatic     -- Ensures no mechanical or automatic watch can ever retain a battery size     IF NEW.power_type IN ('automatic', 'mechanical') THEN         NEW.requires_battery := false;         NEW."Model Number" := 'N/A';     END IF;      RETURN NEW; END; $$ LANGUAGE plpgsql;

-- Trigger Attachment
DROP TRIGGER IF EXISTS apply_horological_guardrails ON "Watch Batteries";

CREATE TRIGGER apply_horological_guardrails
BEFORE INSERT OR UPDATE ON "Watch Batteries"
FOR EACH ROW
EXECUTE FUNCTION enforce_horological_rules();
