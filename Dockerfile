# Railway can build this service from the repository instead of pulling the
# image directly. Repo-backed services receive Railway's template update
# notifications; image-sourced services never do.
#
# The application itself ships as a public, compiled-only image:
#   https://github.com/app-corp/stellar/pkgs/container/stellar
FROM ghcr.io/app-corp/stellar:latest
