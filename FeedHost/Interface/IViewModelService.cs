using System;

namespace FeedHost.Interface
{
    interface IViewModelService<T>
    {
        T ViewModel { get; set; }
    }
}
