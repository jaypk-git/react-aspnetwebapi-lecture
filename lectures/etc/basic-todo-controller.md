```C#
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private static List<Todo> _todos = new List<Todo>();
    private static int _idCounter = 1;

    [HttpGet]
    public ActionResult<IEnumerable<Todo>> GetAll()
    {
        return Ok(_todos);
    }

    [HttpGet("{id}")]
    public ActionResult<Todo> GetById(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        return Ok(todo);
    }

    [HttpPost]
    public ActionResult<Todo> Create(TodoCreateDto todoDto)
    {
        var todo = new Todo
        {
            Id = _idCounter++,
            Title = todoDto.Title,
            IsCompleted = false
        };
        _todos.Add(todo);
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, TodoUpdateDto todoDto)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        todo.Title = todoDto.Title;
        todo.IsCompleted = todoDto.IsCompleted;
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo == null)
        {
            return NotFound();
        }
        _todos.Remove(todo);
        return NoContent();
    }
}

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
}

public class TodoCreateDto
{
    public string Title { get; set; }
}

public class TodoUpdateDto
{
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
}
```
