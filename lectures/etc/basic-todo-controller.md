Program.cs
```
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
app.UseSwagger();
app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
```

TodoAppConroller.cs
```C#
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace usequery2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoAppController : ControllerBase
    {
        private static List<Todo> _todos = new List<Todo>()
        {
          new Todo{
              Id = 0,
              Title = "title0",
              IsCompleted = true
          },
          new Todo{
              Id = 1,
              Title = "title2",
              IsCompleted = false
          }
        };

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
}

```
