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
                else if(user.AccountStatus.Equals(AccountStatus.BLOCKED)){
                    return Ok("blocked");
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
        [Authorize]
        [HttpPost("AddNewCategory")]
        public ActionResult AddNewCategory(BookCategory bc){
            var exists = _appDbContext.BookCategories.Any(b => b.Category.Equals(bc.Category) && b.SubCategory.Equals(bc.SubCategory));
            if(exists)
            {
                return Ok("cannot insert");
            }
            else
            {
                _appDbContext.BookCategories.Add(bc);
                _appDbContext.SaveChanges();
                return Ok("Inserted");
            }
        }
        [Authorize]
        [HttpGet("GetBookCategory")]
        public ActionResult GetBookCategory()
        {
            var bookCategory = _appDbContext.BookCategories.ToList();
            return Ok(bookCategory);
        }

        [Authorize]
        [HttpPost("AddNewBook")]
        public ActionResult AddNewBook(Book book)
        {
            _appDbContext.Books.Add(book);
            _appDbContext.SaveChanges();
            return Ok("Inserted");
        }

        [Authorize]
        [HttpDelete("DeleteBooks")]
        public ActionResult DeleteBooks(int bookId){
            bool exists = _appDbContext.Books.Any(x => x.Id.Equals(bookId));
            if(exists){
                Book book = _appDbContext.Books.FirstOrDefault(x => x.Id.Equals(bookId))!;
                _appDbContext.Books.Remove(book);
                _appDbContext.SaveChanges();
                return Ok("deleted");
            }
            return NotFound();
        }
        [Authorize]
        [HttpGet("ReturnBook")]
        public ActionResult ReturnBook(int userId,int bookId, int fine){
            var order = _appDbContext.Orders.FirstOrDefault(o => o.UserId == userId && o.BookId == bookId);
            if(order is not null){
                order.Returned = true;
                order.ReturnDate = DateTime.Now;
                order.FinePaid = fine;

                _appDbContext.Entry(order).Property(o => o.Returned).IsModified = true;
                _appDbContext.Entry(order).Property(o => o.ReturnDate).IsModified = true;
                _appDbContext.Entry(order).Property(o => o.FinePaid).IsModified = true;

                var book = _appDbContext.Books.FirstOrDefault(b => b.Id.Equals(bookId))!;
                book.Ordered = false;
                _appDbContext.Entry(book).Property(o => o.Ordered).IsModified = true;

                _appDbContext.SaveChanges();

                return Ok("returned");
            }
            return Ok("not returned");
        }
        [Authorize]
        [HttpGet("GetUsers")]
        public ActionResult GetUsers(){
            return Ok(_appDbContext.Users.ToList());
        }
        [Authorize]
        [HttpGet("ApproveRequest")]
        public ActionResult ApproveRequest(int userId){
            var user = _appDbContext.Users.FirstOrDefault(u => u.Id.Equals(userId))!;

            if(user is not null){
                if(user.AccountStatus == AccountStatus.UNAPROOVED){
                    user.AccountStatus = AccountStatus.ACTIVE;
                    _appDbContext.SaveChanges();
                    _emailService.SendEmail(user.Email,$"{user.FirstName} Account Approved",$"""
                        <html>
                            <body>
                                <h2>hi, {user.FirstName} {user.LastName}</h2>
                                <h3>You account approved by admin.</h3>
                                <h3>Now You can login to your account.</h3>
                            </body>
                        </html>
                    """);
                    return Ok("approved");
                }
            }
            return Ok("not approved");
        }
        [Authorize]
        [HttpGet("GetOrders")]
        public ActionResult GetOrders(){
            var orders = _appDbContext.Orders.Include(u => u.User).Include(b => b.Book).ToList();

            if(orders.Any()){
                return Ok(orders);
            }
            else{
                return NotFound();
            }
        }
        [Authorize]
        [HttpGet("SendEmailForPendingReturns")]
        public ActionResult SendEmailForPendingReturns(){
            var orders = _appDbContext.Orders.Include(u => u.User).Include(b => b.Book).Where(o => !o.Returned && o.OrderDate.AddDays(10) < DateTime.Now).ToList();
            orders.ForEach(o => o.FinePaid = (DateTime.Now - o.OrderDate.AddDays(10)).Days * 50);

            orders.Where(o => o.FinePaid == 50).ToList().ForEach(e => {
                var body = $"""
                    <html>
                        <body>
                            <h2>Hi, {e.User?.FirstName} {e.User?.LastName}</h2>
                            <h4>Yesterday was your last day to return Book: {e.Book?.Title}</h4>
                            <h4>From today, every day a fine of 50Rs will be added for this book.</h4>
                            <h4>Please return it as soon as posible.</h4>
                            <h4>If your fine exceeds 500Rs, your account will be blocked</h4>
                            <h4>Thanks</h4>
                        </body>
                    </html>
                """;

                _emailService.SendEmail(e.User?.Email!, "Return Overdue", body);
            });

            orders.Where(o => o.FinePaid > 50 && o.FinePaid <= 500).ToList().ForEach(e => {
                var body = $"""
                    <html>
                        <body>
                            <h2>Hi, {e.User?.FirstName} {e.User?.LastName}</h2>
                            <h4>You have {e.FinePaid}Rs fine on Book: {e.Book?.Title}</h4>
                            <h4>Please pay it as soon as posible.</h4>
                            <h4>Thanks</h4>
                        </body>
                    </html>
                """;

                _emailService.SendEmail(e.User?.Email!, "Fine To Pay", body);
            });

            orders.Where(o => o.FinePaid > 500).ToList().ForEach(e => {
                var body = $"""
                    <html>
                        <body>
                            <h2>Hi, {e.User?.FirstName} {e.User?.LastName}</h2>
                            <h4>You have {e.FinePaid}Rs fine on Book: {e.Book?.Title}</h4>
                            <h4>Your account is BLOCKED.</h4>
                            <h4>Please pay it as soon as posible to UNBLOCK your account.</h4>
                            <h4>Thanks</h4>
                        </body>
                    </html>
                """;

                _emailService.SendEmail(e.User?.Email!, "Fine Overdue", body);
            });

            return Ok("sent");
        }
        [Authorize]
        [HttpGet("BlockFineOverDueUsers")]
        public ActionResult BlockFineOverDueUsers(){
            var orders = _appDbContext.Orders.Include(u => u.User).Include(b => b.Book).Where(o => !o.Returned && o.OrderDate.AddDays(10) < DateTime.Now).ToList();
            orders.ForEach(o => o.FinePaid = (DateTime.Now - o.OrderDate.AddDays(10)).Days * 50);

            orders.Where(o => o.FinePaid > 500).Select(u => u.User).Distinct().ToList().ForEach(e => {

                e!.AccountStatus = AccountStatus.BLOCKED;
            });

            _appDbContext.SaveChanges();

            return Ok("blocked");
        }
        [Authorize]
        [HttpGet("UnBlock")]
        public ActionResult UnBlock(int userId){
            var user  = _appDbContext.Users.FirstOrDefault(u => u.Id.Equals(userId));

            if(user is not null){
                user.AccountStatus = AccountStatus.ACTIVE;

                _appDbContext.SaveChanges();

                return Ok("unblocked");
            }

            return Ok("not unblocked");
        }
    }
}