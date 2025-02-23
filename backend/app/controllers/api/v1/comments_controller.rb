class Api::V1::CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_forum_thread, only: [:create, :destroy]

  # POST /forum_threads/:forum_thread_id/comments
  def create
    @comment = @forum_thread.comments.new(comment_params)
    @comment.user = current_user

    if @comment.save
      render json: { message: "Comment added successfully.", comment: @comment }, status: :created
    else
      render json: { error: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /forum_threads/:forum_thread_id/comments/:id
  def destroy
    @comment = @forum_thread.comments.find(params[:id])
    if @comment.destroy
      render json: { message: "Comment deleted successfully." }, status: :ok
    else
      render json: { error: "Failed to delete comment." }, status: :unprocessable_entity
    end
  end

  private

  def set_forum_thread
    @forum_thread = ForumThread.find(params[:forum_thread_id])
  end

  def comment_params
    params.require(:comment).permit(:content, :mood, :parent_id)
  end
end