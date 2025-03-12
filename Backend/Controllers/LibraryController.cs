using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibraryController : ControllerBase
    {
        private AppDbContext _appDbContext {get;set;}
        private EmailServices _emailService {get;set;}
        private JwtServices _jwt {get;set;}
        public LibraryController( AppDbContext appDbContext, EmailServices emailService, JwtServices jwt)
        {
            _appDbContext = appDbContext;
            _emailService = emailService;
            _jwt = jwt;
        }

        [HttpPost("Register")]
        public ActionResult Register(User user)
        {
            if(!string.IsNullOrEmpty(user.Email)){
                user.AccountStatus = AccountStatus.UNAPROOVED;
                user.UserType = UserType.STUDENT;
                user.CreatedOn = DateTime.Now;
                _appDbContext.Users.Add(user);
                _appDbContext.SaveChanges();

                const string subject = "Account Creation";

                string body = $"""
                    <html>
                        <body>
                            <h1>Hello, {user.FirstName} {user.LastName}</h1>
                            <h2>
                                Your account has been created and we hav sent approval request to admin.
                                Once the request is approved by admin you will receive email, and you will be able to login
                                to your account
                            </h2>
                            <h3>Thanks</h3>
                        </body>
                    </html>
                """;

                _emailService.SendEmail(user.Email, subject, body);

                return Ok(@"Thank you for registering. Your account has been sent for approval. Once it is approved, you will get an email.");
            }
            else{
                return Ok("Email is Required!");
            }
        }

        [HttpGet("Login")]
        public ActionResult Login(string email, string password){
            if(_appDbContext.Users.Any(x => x.Email.Equals(email) && x.Password.Equals(password)))
            {
                var user = _appDbContext.Users.Single(x => x.Email.Equals(email) && x.Password.Equals(password));

                if(user.AccountStatus.Equals(AccountStatus.UNAPROOVED))
                {
                    return Ok("unaproved");
                }
                return Ok(this._jwt.GenerateToken(user));
            }
            return Ok("not found");
        }
        [Authorize]
        [HttpGet("GetBooks")]
        public ActionResult GetBooks(){
            if(_appDbContext.Books.Any()){
                return Ok(_appDbContext.Books.Include(j => j.BookCategory).ToList());
            }
            return NotFound();
        }
        [Authorize]
        [HttpPost("OrderBook")]
        public ActionResult OrderBook(int userId, int bookId)
        {
            bool canOrder = _appDbContext.Orders.Count(o => o.UserId.Equals(userId) && !o.Returned) < 3;
            if(canOrder){
                _appDbContext.Orders.Add(new(){
                    UserId = userId,
                    BookId = bookId,
                    OrderDate = DateTime.Now,
                    ReturnDate = null,
                    Returned = false,
                    FinePaid = 0
                });

                Book book = _appDbContext.Books.FirstOrDefault(x => x.Id.Equals(bookId))!;
                if(book is not null){
                    book.Ordered = true;
                }

                _appDbContext.SaveChanges();

                return Ok("Ordered");
            }
            return Ok("cannot order");
        }
        [Authorize]
        [HttpGet("GetOrdersOfUser")]
        public ActionResult GetOrdersOfUser(int userId){
            var orders = _appDbContext.Orders
            .Include(u => u.User)
            .Include(b => b.Book)
            .Where(x => x.UserId.Equals(userId));
            if(orders.Any())
                return Ok(orders);
            else
                return NotFound();
        }
    }
}