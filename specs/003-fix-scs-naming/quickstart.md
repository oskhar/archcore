# Quickstart: Renaming Feature Branches for Compliance

## Steps to Implement Rename

1. **Verify Current State**:
   ```bash
   git status
   git branch --show-current
   ```
2. **Perform Rename**:
   ```bash
   git branch -m scs-hybrid--production-docker
   ```
3. **Setup Commitizen**:
   Create `.czrc` in the project root:
   ```json
   {
     "path": "cz-customizable"
   }
   ```
   (Alternatively, use `cz-conventional-changelog` if preferred).
4. **Execute Bulk String Replacement**:
   Update all occurrences of `scs-hybrid--production-docker` with `scs-hybrid--production-docker` in:
   - `GEMINI.md`
   - All files in `specs/scs-hybrid--production-docker/`
5. **Move Feature Directory**:
   ```bash
   mv specs/scs-hybrid--production-docker/ specs/scs-hybrid--production-docker/
   ```
6. **Commit Changes**:
   **MANDATORY**: Use `git cz` for the commit.
   ```bash
   git add .
   git cz
   ```
7. **Verify Compliance**:
   ```bash
   ls specs/scs-hybrid--production-docker/
   git branch --show-current
   ```
