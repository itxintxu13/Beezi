from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.cli.console import console

regular_agent = Agent(model=OpenAIChat(id="gpt-4o-mini"), markdown=True)

reasoning_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    reasoning=True,
    markdown=True,
    structured_outputs=True,
)

task = "¿Cuántas 'r' hay en la palabra 'supercalifragilisticexpialidocious'?"

console.rule("[bold green]Agente Regular[/bold green]")
from .utils import safe_print_response

safe_print_response(regular_agent, task)
console.rule("[bold yellow]Agente de Razonamiento[/bold yellow]")
safe_print_response(reasoning_agent, task)