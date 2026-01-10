from phi.agent import Agent
from phi.model.ollama import Ollama
from phi.playground import Playground, serve_playground_app

reasoning_agent = Agent(name="Reasoning Agent", model=Ollama(id="qwq:32b"), markdown=True)

# Interfaz de usuario para el agente de razonamiento
app = Playground(agents=[reasoning_agent]).get_app()


def run_playground():
    try:
        serve_playground_app("local_ai_reasoning_agent:app", reload=True)
    except Exception as e:
        # Fail gracefully and log; prevents entire process from crashing
        import logging

        logging.getLogger(__name__).exception('Failed to serve playground app: %s', e)


if __name__ == "__main__":
    run_playground()