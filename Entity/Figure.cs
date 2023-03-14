
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterceptionCanvas.Models
{
    /// <summary>
    /// Сущность Figure
    /// </summary>
    [Table("Figure")]
    public class Figure
    {
        // В связи с тем что нашнй БД мы не можем хранить JSON-объекты создали промежуточные поля для считывания в них данных с БД
        internal string? start { get; set; }
        internal string? end { get; set; }

        [JsonIgnore]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity), Key()]
        [Column("ID")]
        public int ID { get; set; }

        [Column("type")]
        public string? Type { get; set; }

        [Column("color")]
        public string? Color { get; set; }

        [NotMapped]
        [Column("start")]
        public Point? Start
        {
            get => this.start == null ? Point.Empty : JsonConvert.DeserializeObject<Point>(this.start);
            set => this.start = JsonConvert.SerializeObject(value);
        }

        [NotMapped]
        [Column("end")]
        public Point? End {
            get => this.end == null ? Point.Empty : JsonConvert.DeserializeObject<Point>(this.end);
            set => this.end = JsonConvert.SerializeObject(value);
        }
    }

    public class Point
    {
        public float X { get; set; }
        public float Y { get; set; }

        public static Point Empty => new Point { X = 0,Y = 0 };

    }
}
