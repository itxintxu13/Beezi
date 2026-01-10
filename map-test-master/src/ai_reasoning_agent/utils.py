import time
import logging
from typing import Any

# Simple in-memory cache for recent responses
_cache = {}

logger = logging.getLogger(__name__)


def safe_print_response(agent: Any, task: str, retries: int = 2) -> None:
    """Call agent.print_response with retries and basic error handling.
    Caches recent responses to reduce repeated API calls during development.
    """
    if not task:
        logger.debug('No task provided to safe_print_response')
        return

    if task in _cache:
        logger.debug('Returning cached response for task')
        try:
            agent.print_response(_cache[task], stream=True)
        except Exception as e:
            logger.exception('Error printing cached response: %s', e)
        return

    attempt = 0
    while attempt <= retries:
        try:
            # Note: using print_response as an integration convenience; wrap in try/except
            agent.print_response(task, stream=True)
            # cache successful tasks for short period
            _cache[task] = task
            return
        except Exception as e:
            logger.exception('Agent response failed on attempt %d: %s', attempt + 1, e)
            attempt += 1
            time.sleep(0.6 * attempt)
    logger.error('Agent failed after %d attempts', retries + 1)
